'use client';
{/**/}
const ErrorPage = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
        <div className="p-10 bg-white rounded-lg shadow-xl text-center border border-red-200">
            <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
            <p className="mb-6">{message}</p>
            <button
                onClick={onRetry}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
                Try Again
            </button>
        </div>
    </div>
);

export default ErrorPage;