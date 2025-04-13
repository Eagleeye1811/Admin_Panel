import { Card } from 'react-bootstrap';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconType;
  color: string;
}

const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div style={{ backgroundColor: `${color}20`, padding: '10px', borderRadius: '8px' }}>
            <Icon size={24} color={color} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;