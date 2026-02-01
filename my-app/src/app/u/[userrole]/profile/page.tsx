import { HeaderProfile } from "./ProfileHeader";
import { ProfileTab } from "./tabs/ProfileTab";



export default async function page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const SearchParams = await searchParams;
    const tab = SearchParams.tab;

    let TabToRender;
    switch (tab) {
        case 'profile':
            TabToRender = <ProfileTab />;
            break;
        case 'account':
            TabToRender = "Account";
            break;
        case 'security':
            TabToRender = "Security";
            break;
        default:
            TabToRender = "Profile--";
    }
    return (
        <main>
            <HeaderProfile />
            <section
                className="w-full py-6"
            >
                {TabToRender}
            </section>
        </main>
    )
}