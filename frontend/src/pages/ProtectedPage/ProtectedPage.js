import { UserButton } from "@clerk/clerk-react"

const ProtectedPage = () => {
    return (
        <div>
            <h1>Welcome to the protected page</h1>
            <p>This page is only accessible to signed-in users</p>
        </div>
    );
};
export default ProtectedPage;