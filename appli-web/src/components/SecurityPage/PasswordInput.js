import FormInput from "../FormInput"

function PasswordInput({onChange}) {
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

export default PasswordInput