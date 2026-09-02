import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboarding_done', 'done');
    navigation.replace('Loading');
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem('onboarding_done', 'done');
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <View style={styles.eyeShape}>
                <View style={styles.pupil}>
                  <View style={styles.pupilHighlight} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.title}>VisionFit</Text>
        <Text style={styles.subtitle}>Check your eyes the way you{'\n'}check your steps.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get started  ›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Already screening with us? <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB', // Very light purple/gray
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 50,
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeShape: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#526E53',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pupil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3930',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 6,
    paddingLeft: 6,
  },
  pupilHighlight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#222',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#618264',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  chevron: {
    marginTop: 2,
  },
  loginText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    marginBottom: 30,
  },
  loginLink: {
    color: '#222',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#618264',
  }
});
