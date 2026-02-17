import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createReview } from '../services/reviewService';
import { COLORS, SPACING } from '../utils/constants';
import CustomButton from './CustomButton';

/**
 * Review Form Component
 * Allows users to submit reviews for parking locations
 */
const ReviewForm = ({ parkingId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        if (!comment.trim()) {
            Alert.alert('Error', 'Please write a comment');
            return;
        }

        try {
            setLoading(true);
            const response = await createReview({
                parking_id: parkingId,
                rating,
                comment: comment.trim()
            });

            if (response.success) {
                Alert.alert('Success', 'Review submitted successfully');
                setRating(0);
                setComment('');
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Write a Review</Text>

            {/* Star Rating */}
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={styles.starButton}
                    >
                        <Icon
                            name={star <= rating ? 'star' : 'star-border'}
                            size={32}
                            color={star <= rating ? COLORS.warning : COLORS.gray}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Comment Input */}
            <TextInput
                style={styles.commentInput}
                placeholder="Share your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />

            {/* Submit Button */}
            <CustomButton
                title={loading ? 'Submitting...' : 'Submit Review'}
                onPress={handleSubmit}
                disabled={loading}
            />
        </View>
    );
};

/**
 * Review Item Component
 * Displays a single review
 */
export const ReviewItem = ({ review }) => {
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={20} color={COLORS.white} />
                    </View>
                    <View>
                        <Text style={styles.userName}>{review.user_name}</Text>
                        <Text style={styles.reviewDate}>
                            {new Date(review.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.ratingBadge}>
                    <Icon name="star" size={16} color={COLORS.warning} />
                    <Text style={styles.ratingText}>{review.rating}</Text>
                </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.md
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.xs
    },
    starButton: {
        padding: 4
    },
    commentInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: 14,
        color: COLORS.text,
        marginBottom: SPACING.md,
        minHeight: 100
    },
    reviewCard: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.gray
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warningLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.warning
    },
    reviewComment: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20
    }
});

export default ReviewForm;
