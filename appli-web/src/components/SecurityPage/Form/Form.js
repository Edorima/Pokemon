export default function Form({method, onSubmit, children}) {
    return (
        <form method={method} onSubmit={e => {
            e.preventDefault()
            onSubmit()
        }}>
            {children}
        </form>
    )
}