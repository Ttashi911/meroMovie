// SearchScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, ActivityIndicator, Image } from 'react-native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=bb77b0aa93be95fe9e2b5c3b6ade8711&query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.results) {
        setMovies(data.results);
      } else {
        setError('No movies found');
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={searchMovies} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
              <Text>Release Year: {item.release_date ? item.release_date.split('-')[0] : 'N/A'}</Text>
              <Text>Overview: {item.overview || 'N/A'}</Text>
              <Text>Rating: {item.vote_average || 'N/A'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
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
});

export default SearchScreen;
