import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '@/lib/api';
import NotesClient from './Notes.client';


interface NotesPageProps {
   params: Promise<{ tag: string[] }>,
   searchParams: Promise<{ search: string, page: number, perPage: number }>
}

export default async function NotesPage({ params, searchParams }: NotesPageProps) {
   const queryClient = new QueryClient();
   const { tag } = await params
   const { search, page } = await searchParams

   const initialQuery = search || '';
   const initialPage = Number(page || '1');

   const initialTag = (tag[0] === 'all' || !tag[0]) ? undefined : tag[0];

   await queryClient.prefetchQuery<FetchNotesResponse, Error>({
      queryKey: ['notes', initialQuery, initialPage, initialTag],
      queryFn: () => fetchNotes({ search: initialQuery, page: initialPage, perPage: 12, tag: initialTag }),
   });


   const dehydratedState = dehydrate(queryClient);

   return (


      <HydrationBoundary state={dehydratedState}>
         <NotesClient
            initialQuery={search}
            initialPage={page}
            tag={initialTag}
         />
      </HydrationBoundary>

   );
}