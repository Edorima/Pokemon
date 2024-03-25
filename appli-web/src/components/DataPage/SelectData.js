export default function SelectData({
    defaultOptionText,
    defaultOptionValue = '',
    onChange,
    children
}) {
    return (
        <select id="choix" onChange={onChange}>
            <option value={defaultOptionValue}>{defaultOptionText}</option>
            {children}
        </select>
    )
}