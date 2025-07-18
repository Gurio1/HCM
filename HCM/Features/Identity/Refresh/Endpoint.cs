using FastEndpoints;
using HCM.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace HCM.Features.Identity.Refresh;

public sealed class Endpoint : EndpointWithoutRequest
{
    private readonly TokenIssuer tokenIssuer;
    private readonly ApplicationDbContext context;
    
    public Endpoint(TokenIssuer tokenIssuer,ApplicationDbContext context)
    {
        this.tokenIssuer = tokenIssuer;
        this.context = context;
    }
    
    public override void Configure()
    {
        Post("api/auth/refresh-token");
        AllowAnonymous();
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        string? cookieRefreshToken = HttpContext.Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(cookieRefreshToken))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }
        
        var storedRefreshToken = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == cookieRefreshToken, cancellationToken: ct);
        
        if (!RefreshTokenValidator.IsRefreshTokenValid(storedRefreshToken))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }
        
        var user = await context.Persons
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Id == storedRefreshToken!.PersonId, cancellationToken: ct);
        
        if (user is null)
        {
            await SendUnauthorizedAsync(ct);
            return;
        }
        
        var response = await tokenIssuer.IssueNewTokensAsync(user, storedRefreshToken, HttpContext, ct);
        
        await SendAsync(response, cancellation: ct);
    }
}
