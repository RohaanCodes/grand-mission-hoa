'use server'
import { getQueriesForRequest, submitRequestQuery, respondToQuery, closeRequest, updatePrivateNote, getAllBoardMembers, getAllManagementUsers } from '@/lib/airtable'

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

export async function closeRequestAction(requestId: string) {
  return { success: await closeRequest(requestId) }
}

export async function updatePrivateNoteAction(requestId: string, notes: string) {
  return { success: await updatePrivateNote(requestId, notes) }
}

export async function getPeoplePhotosAction(): Promise<Record<string, string>> {
  const [boardMembers, mgmtUsers] = await Promise.all([
    getAllBoardMembers(),
    getAllManagementUsers(),
  ])
  const photoMap: Record<string, string> = {}
  ;[...boardMembers, ...mgmtUsers].forEach((person) => {
    if (person.email && person.photoUrl) {
      photoMap[person.email.toLowerCase()] = person.photoUrl
    }
  })
  return photoMap
}