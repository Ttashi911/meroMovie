import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const fetchMovies = async () => {
    try {
      const moviesCollection = collection(db, 'movies');
      const querySnapshot = await getDocs(moviesCollection);
      const moviesList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        moviesList.push({ id: doc.id, ...data });
      });
      if (moviesList.length === 0) {
        setError('No movies found.');
      }
      setMovies(moviesList);
    } catch (error) {
      console.error('Error fetching movies: ', error);
      setError('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const checkIfMovieExists = async (movieId) => {
    try {
      const wishlistQuery = query(collection(db, 'users', userId, 'wishlist'), where('id', '==', movieId));
      const querySnapshot = await getDocs(wishlistQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking wishlist: ', error);
      return false;
    }
  };

  const addToWishlist = async (movie) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to add this movie to your wishlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const movieExists = await checkIfMovieExists(movie.id);

            if (movieExists) {
              Alert.alert('Already in Wishlist', 'This movie is already in your wishlist.');
              return; 
            }

            try {
              const movieData = {
                movieName: movie.movieName || 'No Title',
                genre: movie.genre || 'No Genre',
                rating: movie.rating !== undefined ? movie.rating : 'N/A',
                releaseDate: movie.releaseDate || 'N/A',
                imageURL: movie.imageURL || 'https://via.placeholder.com/150',
              };
              await setDoc(doc(db, 'users', userId, 'wishlist', movie.id), movieData);
              Alert.alert('Added to Wishlist', 'The movie has been added to your wishlist.');
            } catch (error) {
              console.error('Error adding to wishlist: ', error);
              Alert.alert('Error', 'Failed to add the movie to your wishlist.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image
              source={{ uri: item.imageURL || 'https://via.placeholder.com/150' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.movieDetails}>
              <Text style={styles.title}>{item.movieName || 'No Title'}</Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Release Date: </Text>
                {item.releaseDate || 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Genre: </Text>
                {item.genre || 'No Genre'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Director: </Text>
                {item.director || 'No Director'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Description: </Text>
                {item.movieDescription || 'No Description'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>IMDb Rating: </Text>
                {item.rating !== undefined ? item.rating.toFixed(1) : 'N/A'}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => addToWishlist(item)}>
                <MaterialIcons name="playlist-add" size={24} color="green" />
                <Text style={styles.buttonText}>Add to Wishlist</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  movieItem: {
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width - 32,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: (width - 32) * 9 / 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'green',
    marginLeft: 5,
  },
});

export default HomeScreen;
