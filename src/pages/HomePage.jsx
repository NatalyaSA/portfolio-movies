import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.kinopoisk.dev/v1.4";
const API_KEY = import.meta.env.VITE_KP_API_KEY;
const API_OPTIONS  = {
    method: "GET",
    headers: {
        accept: "application/json",
       "X-API-KEY": API_KEY
    }
};

function HomePage() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [MoviesTotal, setMoviesTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [changeCount, setChangeCount] = useState(0);
    const [urlMiddlePart, setUrlMiddlePart] = useState("/movie?votes.imdb=10000-4000000&type=movie");

    const loadMovies = async () => {
        if (loading) return
        setLoading(true);
        try {
            const endpoint = `${API_BASE_URL}${urlMiddlePart}&page=${page}&limit=24`
            const response = await fetch(endpoint, API_OPTIONS);
            if (response.ok) {
                const data = await response.json();
                setEndPage(data.pages);
                setMoviesTotal(data.total);
                setMovies(m => [...m, ...data.docs]);
            } else {
                throw new Error("Не удалось загрузить фильмы...");
            }
        } catch(error) {
            console.error(error);
            setErrorMessage("Не удалось загрузить фильмы...");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMovies();
    }, [page, changeCount])

    useDebounce(() => setDebouncedSearchQuery(searchQuery), 500, [searchQuery])

    useEffect(() => { handleSearch() }, [debouncedSearchQuery])

    const handleSearch = async (e) => {
        e && e.preventDefault();

        setUrlMiddlePart( u => u = debouncedSearchQuery.trim()
        ? `/movie/search?query=${encodeURIComponent(debouncedSearchQuery)}`
        : "/movie?votes.imdb=10000-4000000&type=movie");
        setChangeCount(c => c + 1);
        setPage(1);
        setMovies([]);
    };

    const loadMore = () => setPage(p => p + 1);

    return(
        <>
            <form className="form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Введите название фильма..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="button" type="submit">Найти</button>
            </form>
            <div className="content">
                {errorMessage
                    ? <div className="error">{errorMessage}</div>
                    : movies.length === 0
                        ? (!loading && <div>Фильмы не найдены...</div>)
                        : <>
                            <div className="movie-grid">
                                {movies.map(movie => (<MovieCard key={movie.id} movie={movie} />))}
                            </div>
                            <div className="movie-count">Фильмов: {movies.length} из {MoviesTotal}</div>
                        </>
                }
                {loading && <Spinner />}
                {page < endPage && <button className="button" onClick={loadMore}>Загрузить ещё...</button>}
            </div>
        </>
    )
}

export default HomePage;