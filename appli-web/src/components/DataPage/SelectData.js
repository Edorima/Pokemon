export default function SelectData({
    defaultOptionText,
    defaultOptionValue = '',
    selectedValue,
    onChange,
    name,
    children
}) {
    return (
        <select className="choix" onChange={onChange} name={name} value={selectedValue}>
            <option value={defaultOptionValue}>{defaultOptionText}</option>
            {children}
        </select>
    )
}