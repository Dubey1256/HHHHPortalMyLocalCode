import * as React from 'react';
import { useState, useEffect } from 'react';

interface Rating {
    SkillTitle: string;
    current: number;
    max: number;
    Comment: string;
}

const StarRating: React.FC<{ rating: Rating; onRatingSelected: (rating: Rating) => void }> = ({
    rating,
    onRatingSelected,
}) => {
    const [stars, setStars] = useState<Array<{ filled: boolean }>>([]);

    useEffect(() => {
        const updateStars = () => {
            const newStars = [];
            for (let i = 0; i < rating.max; i++) {
                newStars.push({
                    filled: i < rating.current,
                });
            }
            setStars(newStars);
        };

        updateStars();
    }, [rating.current, rating.max]);

    const toggle = (index: number) => {
        onRatingSelected({
            ...rating,
            current: index + 1,
        });
    };

    return (
        <ul className="rating" onClick={() => toggle(stars.length - 1)}>
            {stars.map((star, index) => (
                <li key={index} className={star.filled ? 'filled' : ''}>
                    ★
                </li>
            ))}
        </ul>
    );
};

interface FeedbackProps {
    ratings: Rating[];
}

const Feedback: React.FC<FeedbackProps> = ({ ratings }) => {
    const [localRatings, setLocalRatings] = useState<Rating[]>(ratings);

    const handleRatingSelected = (index: number, selectedRating: number) => {
        const updatedRatings = [...localRatings];
        updatedRatings[index].current = selectedRating;
        setLocalRatings(updatedRatings);
    };

    return (
        <details>
            <summary>
                <a>
                    <span>Feedback</span>
                </a>
            </summary>
            <div className="expand-AccordionContent clearfix">
                <div className="star-block">
                    {localRatings.map((rating, index) => (
                        <div key={index} className="skillBlock">
                            <div className="skillTitle">{rating.SkillTitle}</div>
                            <StarRating rating={rating} onRatingSelected={(selectedRating) => handleRatingSelected(index, selectedRating.current)} />
                            <div className="comment-block">
                                <textarea
                                    id={`textarea-${index}`}
                                    name="remarks"
                                    value={rating.Comment}
                                    onChange={(e) => {
                                        const updatedRatings = [...localRatings];
                                        updatedRatings[index].Comment = e.target.value;
                                        setLocalRatings(updatedRatings);
                                    }}
                                    className="full_width"
                                    auto-resize
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </details>
    );
};

export default Feedback;
