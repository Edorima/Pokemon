import FormInput from "../FormInput"

function UsernameInput({onChange}) {
    return (
        <FormInput
            id="username"
            size={32}
            placeholder="Pseudo"
            onChange={onChange}
        />
    )
}

export default UsernameInput