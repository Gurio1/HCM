using HCM.Domain.Identity.AccessTokens;
using HCM.Domain.Identity.RefreshTokens;
using HCM.Domain.Persons;
using HCM.Features.Identity.Contracts;
using HCM.Infrastructure;
using Microsoft.Extensions.Options;

namespace HCM.Features.Identity;

public sealed class TokenIssuer
{
    private readonly JwtTokenGenerator jwtTokenGenerator;
    private readonly ApplicationDbContext context;
    private readonly JwtOptions options;
    
    public TokenIssuer(JwtTokenGenerator jwtTokenGenerator, ApplicationDbContext context,IOptions<JwtOptions> options)
    {
        this.jwtTokenGenerator = jwtTokenGenerator;
        this.context = context;
        this.options = options.Value;
    }
    
    public async Task<AuthResponse> IssueNewTokensAsync(
        Person person,
        RefreshToken? previousToken,
        HttpContext httpContext,
        CancellationToken ct = default)
    {
        var accessToken = jwtTokenGenerator.GenerateAccessToken(person);
        
        var refreshToken = RefreshToken.Create(person.Id,options.RefreshTokenHours);
        context.RefreshTokens.Add(refreshToken);
        
        if (previousToken is not null)
            context.RefreshTokens.Remove(previousToken);
        
        await context.SaveChangesAsync(ct);
        
        AuthCookieWriter.SetRefreshTokenCookie(httpContext, refreshToken);
        
        return new AuthResponse
        {
            AccessToken = accessToken.Token,
            AccessExpiry = accessToken.TokenExpiryTime,
            RefreshExpiry = refreshToken.ExpiresAt
        };
    }
}
