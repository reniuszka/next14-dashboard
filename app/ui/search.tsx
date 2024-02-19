'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); // /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'} When to use the useSearchParams() hook vs. the searchParams prop?
  // You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.
  // <Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
  // <Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
  // As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.
  const pathname = usePathname(); // '/dashboard/invoices'
  const { replace } = useRouter(); // replaces url
  const handleSearch = useDebouncedCallback((term) => {
    // function handleSearch(term: string) {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    console.log(
      'params',
      params,
      'type',
      typeof params,
      'make it string',
      params.toString(),
      term,
    );
    if (term) {
      // if there search is not empty
      params.set('query', term);
    } else {
      //if empty clean params
      params.delete('query');
    }
    // replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee". The URL is updated without reloading the page, thanks to Next.js's client-side navigation: params
    // URLSearchParams { query → "jeans" }
    //  type object make it string query=jeans
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  // This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms). By debouncing, you can reduce the number of requests sent to your database, thus saving resources.
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
