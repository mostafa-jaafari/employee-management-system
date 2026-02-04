import EmployeePage from "./EmployeePage";
import AdminPage from "./AdminPage";
import NotFoundPage from "./NotFoundPage";


export default async function page({ params }: { params: Promise<{ userrole: string }> }){
    const CurrentPage = (await params).userrole;

    let RenderTab;
    switch (CurrentPage) {
        case "employee":
            RenderTab = <EmployeePage />
            break;
        case "admin":
            RenderTab = <AdminPage />
            break;
        default:
            RenderTab = <NotFoundPage />
            break;
    }
    return (
        <main>
            {RenderTab}
        </main>
    )
}