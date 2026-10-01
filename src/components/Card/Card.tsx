import './card.css';

export interface CardProps {
  title: string;
  description: string;
  tag?: string;
  isHighlighted?: boolean;
}

export const Card = ({
  title,
  description,
  tag,
  isHighlighted = false,
}: CardProps) => (
  <article
    className={['product-card', isHighlighted && 'product-card--highlighted']
      .filter(Boolean)
      .join(' ')}
  >
    {tag && <span className="product-card__tag">{tag}</span>}
    <h3 className="product-card__title">{title}</h3>
    <p className="product-card__description">{description}</p>
  </article>
);
