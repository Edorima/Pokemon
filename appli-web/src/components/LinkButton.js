export default function LinkButton({
    id,
    className,
    href,
    onMouseEnter,
    children
}) {
    return (
        <a type="button"
           id={id}
           className={className}
           href={href}
           onMouseEnter={onMouseEnter}>
            {children}
        </a>
    )
}