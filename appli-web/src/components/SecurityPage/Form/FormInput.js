export default function FormInput({id, placeholder, size, onChange, type}) {
    return (
        <input
            id={id}
            type={type}
            size={size}
            placeholder={placeholder}
            onChange={onChange}
            required
        />
    )
}