function ErrorMessage({error}) {
    return (
        <>
        {error &&
        <div id="error-message" className={error ? "" : "hidden"}>
            {error}
        </div>}
        </>
    )
}

export default ErrorMessage