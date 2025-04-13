import { Table } from 'react-bootstrap';
import { Story } from '../../types/api.types';

interface RecentStoriesProps {
  stories?: Story[];
}

const RecentStories = ({ stories = [] }: RecentStoriesProps) => {
  if (!stories || stories.length === 0) {
    return <p>No recent stories available.</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Duration</th>
          <th>Plays</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {stories.map((story) => (
          <tr key={story._id}>
            <td>{story.title}</td>
            <td>{story.category.name}</td>
            <td>{Math.floor(story.duration / 60)}:{(story.duration % 60).toString().padStart(2, '0')}</td>
            <td>{story.plays}</td>
            <td>{new Date(story.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RecentStories;