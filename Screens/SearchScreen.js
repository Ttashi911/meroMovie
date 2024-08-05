import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_KEY = 'bb77b0aa93be95fe9e2b5c3b6ade8711';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      return null;
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const moviesWithDetails = await Promise.all(
          data.results.map(async (movie) => {
            const details = await fetchMovieDetails(movie.id);
            return {
              ...movie,
              production_countries: details && details.production_countries ? details.production_countries : [],
            };
          })
        );
        setMovies(moviesWithDetails);
      } else {
        setMovies([]);
        Alert.alert('No Movies Found', 'Please try again.');
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Search for movies around the world!!!
      </Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for a movie..."
          placeholderTextColor="#fff"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.button} onPress={searchMovies}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {searchQuery === '' && movies.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Image
            source={require('../assets/search.png')}
            style={styles.placeholderImage}
          />
          <Text style={styles.placeholderText}>Search for a movie</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              {item.poster_path ? (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  style={styles.poster}
                />
              ) : (
                <View style={styles.noPoster}>
                  <Text>No Image</Text>
                </View>
              )}
              <View style={styles.movieDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>
                  <Text style={styles.boldLabel}>Release Year: </Text>
                  {item.release_date ? item.release_date.split('-')[0] : 'N/A'}
                </Text>
                <Text>
                  <Text style={styles.boldLabel}>Overview: </Text>
                  {item.overview || 'N/A'}
                </Text>
                <Text>
                  <Text style={styles.boldLabel}>Rating: </Text>
                  {item.vote_average || 'N/A'}
                </Text>
                <Text>
                  <Text style={styles.boldLabel}>Country: </Text>
                  {item.production_countries.map((country) => country.name).join(', ') || 'N/A'}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#E35335',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  button: {
    backgroundColor: '#E35335',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#333',
  },
  movieItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  poster: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  noPoster: {
    width: 100,
    height: 150,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  boldLabel: {
    fontWeight: 'bold',
  },
});

export default SearchScreen;
