using FluentValidation;

namespace HCM.Shared.Validators.Persons;

public static class NameValidator
{
    public static IRuleBuilderOptions<T, string> ValidName<T>(this IRuleBuilder<T, string> rule,string propName) =>
        rule
            .NotEmpty().WithMessage($"{propName} is required.")
            .MaximumLength(50).WithMessage($"{propName} must be at most 50 characters.")
            .Matches(@"^[\p{L} \.'\-]+$").WithMessage($"{propName} contains invalid characters.");
}
