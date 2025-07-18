using FastEndpoints;
using MediatR;

namespace HCM.Features.Identity.Login;

public sealed class Endpoint : Endpoint<LoginRequest>
{
    private readonly IMediator mediator;
    private readonly TokenIssuer tokenIssuer;
    
    public Endpoint(IMediator mediator,TokenIssuer tokenIssuer)
    {
        this.mediator = mediator;
        this.tokenIssuer = tokenIssuer;
    }
    
    public override void Configure()
    {
        Post("api/auth/login");
        AllowAnonymous();
    }
    
    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var result = await mediator.Send(new LoginCommand(req.Email, req.Password), ct);
        
        if (result.IsFailure)
        {
            await SendAsync(new {Error = result.Error.Description}, result.Error.Code, ct);
            return;
        }
        
        var response = await tokenIssuer.IssueNewTokensAsync(result.Value, null, HttpContext, ct);
        
        await SendAsync(response, cancellation: ct);
    }
}
