import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, writeBatch, getDocs, query } from 'firebase/firestore';
import { clients, invoices, tasks, inventory } from '@/lib/data';

async function seedCollection(collectionName: string, data: any[]) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);
    const snapshot = await getDocs(q);

    // If collection is not empty, don't seed
    if (!snapshot.empty) {
        console.log(`Collection ${collectionName} is not empty. Skipping seed.`);
        return { message: `Collection ${collectionName} already contains data.`, skipped: true };
    }

    const batch = writeBatch(db);
    data.forEach((item) => {
        const { id, ...rest } = item;
        const docRef = collectionRef.doc(id);
        batch.set(docRef, rest);
    });
    await batch.commit();
    console.log(`Seeded ${collectionName} collection.`);
    return { message: `Successfully seeded ${collectionName}.`, skipped: false };
}

export async function GET() {
    try {
        const results = [];
        results.push(await seedCollection('clients', clients));
        results.push(await seedCollection('invoices', invoices));
        results.push(await seedCollection('tasks', tasks));
        results.push(await seedCollection('inventory', inventory));
        
        const allSkipped = results.every(r => r.skipped);

        if (allSkipped) {
            return NextResponse.json({ message: 'All collections already contain data. No new data was seeded.' });
        }

        return NextResponse.json({ message: 'Database seeding completed.', results });

    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: (error as Error).message }, { status: 500 });
    }
}
