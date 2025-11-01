import { NextResponse } from 'next/server';
import IndianLawData from '@/lib/indian-law-data';

/**
 * GET /api/legal-data/sections?act=IPC&section=420
 * Get details of specific legal section
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const act = searchParams.get('act');
    const section = searchParams.get('section');
    const query = searchParams.get('query');

    // Search across all acts
    if (query) {
      const results = IndianLawData.searchLegalSections(query);
      return NextResponse.json({
        results,
        total: results.length,
        query,
      });
    }

    // Get specific section
    if (act && section) {
      const details = IndianLawData.getSectionDetails(act, section);
      if (!details) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }
      return NextResponse.json({
        act,
        section,
        details,
        last_updated: IndianLawData.LEGAL_RESOURCES.last_synced,
      });
    }

    // Return all sections for an act
    if (act) {
      const actMap: Record<string, any> = {
        'IPC': IndianLawData.IPC_SECTIONS,
        'GST': IndianLawData.GST_SECTIONS,
        'CRPC': IndianLawData.CRPC_SECTIONS,
        'CrPC': IndianLawData.CRPC_SECTIONS,
        'NI': IndianLawData.NI_ACT_SECTIONS,
        'CONTRACT': IndianLawData.CONTRACT_ACT_SECTIONS,
      };

      const sections = actMap[act.toUpperCase()];
      if (!sections) {
        return NextResponse.json({ error: 'Act not found' }, { status: 404 });
      }

      return NextResponse.json({
        act,
        sections,
        count: Object.keys(sections).length,
        last_updated: IndianLawData.LEGAL_RESOURCES.last_synced,
      });
    }

    // Return list of available acts
    return NextResponse.json({
      acts: [
        { code: 'IPC', name: 'Indian Penal Code', sections: Object.keys(IndianLawData.IPC_SECTIONS).length },
        { code: 'GST', name: 'Goods & Services Tax Act', sections: Object.keys(IndianLawData.GST_SECTIONS).length },
        { code: 'CRPC', name: 'Code of Criminal Procedure', sections: Object.keys(IndianLawData.CRPC_SECTIONS).length },
        { code: 'NI', name: 'Negotiable Instruments Act', sections: Object.keys(IndianLawData.NI_ACT_SECTIONS).length },
        { code: 'CONTRACT', name: 'Indian Contract Act', sections: Object.keys(IndianLawData.CONTRACT_ACT_SECTIONS).length },
      ],
      last_updated: IndianLawData.LEGAL_RESOURCES.last_synced,
      resources: IndianLawData.LEGAL_RESOURCES,
    });

  } catch (error: any) {
    console.error('Error fetching legal data:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

