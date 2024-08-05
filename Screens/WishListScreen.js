import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser.uid; // Get current user ID

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, 'wishlist'),
      (querySnapshot) => {
        const wishlistList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          wishlistList.push({ id: doc.id, ...data });
        });
        setWishlist(wishlistList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching wishlist: ', error);
        setError('Failed to fetch wishlist.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const removeFromWishlist = async (movieId) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove this movie from your wishlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const docRef = doc(db, 'users', userId, 'wishlist', movieId);
              await deleteDoc(docRef);
              setWishlist((prevWishlist) => prevWishlist.filter((movie) => movie.id !== movieId));
              Alert.alert('Removed from Wishlist', 'The movie has been removed from your wishlist.');
            } catch (error) {
              console.error('Error removing from wishlist:', error);
              Alert.alert('Error', 'Failed to remove the movie from your wishlist.');
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
        data={wishlist}
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
                <Text style={styles.label}>IMDb Rating: </Text>
                {item.rating !== undefined ? item.rating.toFixed(1) : 'N/A'}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => removeFromWishlist(item.id)}>
                <Text style={styles.buttonText}>Remove from Wishlist</Text>
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
    flexDirection: 'row',
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
    width: '40%', // Set width to 45% of the container
    height: ((width - 32) * 0.45 * 9 / 16) * 1.5, // Slightly increase the height to make the image larger
    borderRadius: 8,
    marginRight: 10,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#E35335',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default WishlistScreen;
