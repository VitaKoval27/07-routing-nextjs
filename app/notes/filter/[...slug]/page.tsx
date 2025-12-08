import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
   params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
   const queryClient = new QueryClient();
   const { slug } = await params;


   const initialTag = (slug[0] === 'all' || !slug[0]) ? undefined : slug[0];

   await queryClient.prefetchQuery<FetchNotesResponse, Error>({
      queryKey: ['notes', "", 1, initialTag],
      queryFn: () => fetchNotes({
         search: '',
         page: 1,
         perPage: 12,
         tag: initialTag
      }),
   });

   const dehydratedState = dehydrate(queryClient);

   return (
      <HydrationBoundary state={dehydratedState}>
         <NotesClient tag={initialTag} />
      </HydrationBoundary>
   );
}