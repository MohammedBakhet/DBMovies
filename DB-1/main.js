import mongoose, {connect} from "mongoose";
import prompt from "prompt-sync";


await mongoose.connect("mongodb://localhost:27017/MohammedAssignment");
const db = mongoose.connection;


const movieSchema = new mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genres: [String],
  ratings: [String],
  cast: [String]
});

const Movie = mongoose.model("Movie", movieSchema);


const p = prompt();

async function updateMovie() {
    const titleToUpdate = p("Enter the title of the movie to update: ");
    const movieToUpdate = await Movie.findOne({ title: titleToUpdate });
    if (movieToUpdate) {
        const updateFields = {
            title: p("Enter the new title (press enter to keep the existing one): ") || movieToUpdate.title,
            director: p("Enter the new director (press enter to keep the existing one): ") || movieToUpdate.director,
            releaseYear: parseInt(p("Enter the new release year (press enter to keep the existing one): ")) || movieToUpdate.releaseYear
        };
        await Movie.updateOne({ _id: movieToUpdate._id }, updateFields);
        console.log("Movie updated successfully!");
    } else {
        console.log("Movie not found!");
    }
}

async function deleteMovie() {
    const titleToDelete = p("Enter the title of the movie to delete: ");
    const deletedMovie = await Movie.findOneAndDelete({ title: titleToDelete });
    if (deletedMovie) {
        console.log(`Movie "${titleToDelete}" deleted successfully!`);
    } else {
        console.log(`Movie "${titleToDelete}" not found!`);
    }
}


async function main() {
    let runApp = true;

    while (runApp) {
        console.log("Menu");
        console.log("1. View all movies");
        console.log("2. Add a new movie");
        console.log("3. Update a movie (Update title, director, or release date)");
        console.log("4. Delete a movie");
        console.log("5. Exit");

        let input = p("Make a Choice by entering a number:");

        if (input === "1") {
            try {
                const movies = await Movie.find({}).exec();
                console.log("All Movies");
                console.log(movies);
                console.log("Number of movies:", movies.length);
                
              } catch (error) {
                console.error("Error fetching movies:", error);
                
              };
        } else if (input === "2") {
            console.log("Add a new movie");
            const newMovie = {
                title: p("Enter the title: "),
                director: p("Enter the director: "),
                releaseYear: parseInt(p("Enter the release year: ")),
                genres: p("Enter the genres separated by commas: ").split(",").map(genre => genre.trim()),
                ratings: parseFloat(p("Enter the ratings: ")),
                cast: p("Enter the cast members separated by commas: ").split(",").map(cast => cast.trim())
            };
            await Movie.create(newMovie);
            console.log("New movie added successfully!");
        } else if (input === "3") {
            await updateMovie();
        } else if (input === "4") {
            await deleteMovie();
        } else if (input === "5") {
            console.log("Exiting the application...");
            runApp = false;
        } else {
            console.log("Invalid choice. Please enter a valid option.");
        }
    }

  
    await mongoose.connection.close();
}


main();
