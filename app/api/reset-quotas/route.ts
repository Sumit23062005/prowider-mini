import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Provider from '../../../models/Provider';

export async function POST() {
	try {
		await dbConnect();
		await Provider.updateMany({}, { usedQuota: 0 });
		return NextResponse.json({ success: true, message: 'All provider quotas reset.' });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
	}
}
