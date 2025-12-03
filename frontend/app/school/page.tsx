export const dynamic = "force-dynamic";

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>School Detail Page</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
