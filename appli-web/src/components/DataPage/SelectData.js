export default function SelectData({
    defaultOptionText,
    onChange,
    children
}) {
    return (
        <select id="choix" onChange={onChange}>
            <option value="">{defaultOptionText}</option>
            {children}
        </select>
    )
}