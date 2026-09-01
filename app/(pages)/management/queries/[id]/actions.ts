'use server'
import Airtable from 'airtable'

export async function submitQueryResponseAction(queryId: string, responseText: string) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)
  await base('Request Queries').update([
    { id: queryId, fields: { 'Response Text': responseText, Answered: true } },
  ])
  return { success: true }
}