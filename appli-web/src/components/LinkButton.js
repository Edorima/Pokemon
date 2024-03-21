function LinkButton({id, className, href, children}) {
    return (
        <a type="button" id={id} className={className} href={href}>
            {children}
        </a>
    )
}

export default LinkButton