import React, { useState, useEffect } from 'react';

interface Rating {
    SkillTitle: string;
    current: number;
    max: number;
    Comment: string;
}

interface StarProps {
    filled: boolean;
    onClick: () => void;
}

const Star: React.FC<StarProps> = ({ filled, onClick }) => (
    <li className={filled ? 'filled list-none' : 'list-none'} onClick={onClick}>
        ★
    </li>
);

const CandidateRating: React.FC<{ rating: Rating; onRatingSelected: (rating: Rating) => void }> = ({ rating, onRatingSelected }) => {
    const [stars, setStars] = useState<Array<{ filled: boolean }>>([]);

    useEffect(() => {
        const updateStars = () => {
            const newStars = [];
            for (let i = 0; i < rating.max/2; i++) {
                newStars.push({
                    filled: i < Math.floor(rating.current/2),
                });
            }
            setStars(newStars);
        };

        updateStars();
    }, [rating.current, rating.max]);

    const toggle = (index: number) => {
        const updatedRating: Rating = {
            ...rating,
            current: index + 1,
        };
        onRatingSelected(updatedRating);
    };

    const updateComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedRating: Rating = {
            ...rating,
            Comment: event.target.value,
        };
        onRatingSelected(updatedRating);
    };

    return (
        <>
        <div className='col-md-3'>
        <div className='alignCenter'>
        <ul className="rating mb-0 mx-2 p-0 alignCenter">
                {stars.map((star, index) => (
                    <Star key={index} filled={star.filled} onClick={() => toggle(index)} />
                ))}
            </ul>
        </div>
        </div>
        
           <div className='col-md-6 p-0'>
                <div className='alignCenter'>
                    {rating?.Comment ? (
                        <div dangerouslySetInnerHTML={{ __html: rating?.Comment }} />
                    ) : (
                        <div className="no-remarks-message-container">
                            <div className="no-remarks-message">No comment to show</div>
                        </div>
                    )}
                </div></div>
        </>
    );
};

export default CandidateRating;
