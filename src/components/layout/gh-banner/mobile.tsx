export const GitHubBannerMobile = () => {
    return(
        <a
        className="gh-link"
        href="https://crm.geniex.pro/demo-request"
        target="_blank">
        <div
        className="mobile-banner"
        style={{
            flexDirection: "row",
            justifyContent: "center",
            padding:"1em",
            backgroundColor: "black",
            alignItems: "center"
        }}
        >
            <p
            style={{
                textAlign: "center",
                color: "white",
                margin: "0"
            }}
            >
            Need Customisation For Your Specific Business Needs? Click Here.
            </p>
        </div>
        </a>
    )
}