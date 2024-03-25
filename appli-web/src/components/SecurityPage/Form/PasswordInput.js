import FormInput from "./FormInput"

export default function PasswordInput({onChange}) {
    return (
        <FormInput
            id="password"
            type="password"
            size={32}
            placeholder="Mot de passe"
            onChange={onChange}
        />
    )
}