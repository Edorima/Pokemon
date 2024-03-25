import FormInput from "./FormInput"

export default function UsernameInput({onChange}) {
    return (
        <FormInput
            id="username"
            size={32}
            placeholder="Pseudo"
            onChange={onChange}
        />
    )
}