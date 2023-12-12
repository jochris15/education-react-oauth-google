import Card from "../components/Card";
import axios from 'axios';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import gearLoad from "./assets/Gear-0.2s-264px.svg"

export default function Home({ url }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState({
        search: ""
    });

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.access_token}`
        }
    }

    async function fetchBooks() {
        try {
            setLoading(true)
            const { data } = await axios.get(`${url}/books`, config);
            setBooks(data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: error.response.data.message,
            });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [])

    // functions to handle query params
    async function updateQuery(newQuery) {
        const { search } = newQuery;
        let newURL = `${url}/books?`;
        if (search) newURL += `q=${search}`;

        try {
            const { data } = await axios.get(newURL, config);
            setBooks(data);
            setQuery(newQuery);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: error.response.data.message,
            });
        }
    }

    // search
    function searchOnChange(event) {
        let newSearch = event.target.value;
        setSearch(newSearch);
    }

    function applySearch(event) {
        event.preventDefault();
        let newQuery = { ...query, search }
        updateQuery(newQuery);
    }

    return (
        <>
            <div id="PAGE-HOME" className="p-3">
                <header className="pt-5 flex justify-center items-center">
                    {/* search */}
                    <form className="flex justify-center items-center">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search"
                            className="input input-bordered input-accent w-24 md:w-auto mx-1 input-sm"
                            onChange={searchOnChange}
                        />
                        <button onClick={applySearch} type="submit" className="btn btn-ghost btn-circle" >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </header>
                <div className="divider px-10"></div>
                {loading ? (
                    <div className="mt-32 flex justify-center items-center">
                        <img src={gearLoad} />
                    </div>
                ) : (
                    <main className="grid grid-cols-3 gap-5 px-10 my-8 bg-base-100">
                        {books.map(book => {
                            return <Card key={book.id} book={book} url={url} />
                        })}
                    </main>
                )}
            </div >
        </>
    )
}