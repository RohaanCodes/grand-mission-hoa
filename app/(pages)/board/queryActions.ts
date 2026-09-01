'use server'
import { getQueriesForRequest, submitRequestQuery, respondToQuery } from '@/lib/airtable'

export async function getQueriesAction(requestIdNumber: number) {
  return getQueriesForRequest(requestIdNumber)
}

export async function askQueryAction(data: {
  requestIdNumber: number
  queryText: string
  askedByName: string
  askedByEmail: string
}) {
  return { success: await submitRequestQuery(data) }
}

export async function respondToQueryAction(queryId: string, responseText: string) {
  return { success: await respondToQuery(queryId, responseText) }
}