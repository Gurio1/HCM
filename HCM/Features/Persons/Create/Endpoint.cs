using FastEndpoints;
using HCM.Domain.Identity;
using HCM.Domain.Persons;
using HCM.Shared;
using Microsoft.AspNetCore.Identity;

namespace HCM.Features.Persons.Create;

public sealed class Endpoint : Endpoint<CreatePersonRequest>
{
    private readonly PersonCreator personCreator;
    private readonly IPasswordHasher<Person> passwordHasher;
    
    public Endpoint(PersonCreator personCreator,IPasswordHasher<Person> passwordHasher)
    {
        this.personCreator = personCreator;
        this.passwordHasher = passwordHasher;
    }
    
    public override void Configure()
    {
        Post(EndpointSettings.DefaultName);
        Roles(ApplicationRoles.HrAdmin);
    }
    
    public override async Task HandleAsync(CreatePersonRequest req, CancellationToken ct)
    {
        var person = Person.Create(req.FirstName, req.LastName, req.Email, req.JobTitle, req.Salary, req.Department,
            req.Role, passwordHasher, req.Password);
        
        var personCreationResult = await personCreator.Create(person, ct);
        
        if (personCreationResult.IsFailure)
        {
            await SendAsync(new {Error = personCreationResult.Error.Description}, personCreationResult.Error.Code, ct);
            return;
        }
        
        await SendCreatedAtAsync(IEndpoint.GetName<GetById.Endpoint>(), cancellation: ct);
    }
}
