function MovieCard({ movie : { poster, name, alternativeName, rating, genres, year} }) {
    const title = name ? name : alternativeName;
    return(
        <div className="movie-card">
            {poster
                ? poster.previewUrl
                    ? <img
                        className="movie-card__image"
                        src={poster.previewUrl}
                        alt={title}
                        width="300"
                        height="450"
                     />
                    : <div className="no-poster">постер<br />не<br />найден</div>
                : <div className="no-poster">постер<br />не<br />найден</div>
            }
            <div className="movie-card__desc">
                <h3 className="movie-card__title">{title}</h3>
                <div className="movie-card__info">
                    <span className="star">⭐️</span>
                    <span>{rating.imdb ? rating.imdb : "-"}</span>
                    <span>•</span>
                    <span>{genres && genres.length !== 0 ? genres[0].name : "-"}</span>
                    <span>•</span>
                    <span>{year ? year : "-"}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard;