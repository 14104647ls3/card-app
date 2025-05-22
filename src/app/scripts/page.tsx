import { seed } from './seed';

export default async function Page() {
    await seed();
    return <div>Seed completed</div>;
}
