import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StoryModal from '../../components/stories/StoryModal';
import { getStories, createStory, updateStory, deleteStory } from '../../services/storyService';
import { Story } from '../../types/api.types';

const StoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (data: Partial<Story>) => {
    try {
      if (selectedStory) {
        await updateStory(selectedStory._id, data);
      } else {
        await createStory(data);
      }
      fetchStories();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save story:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(id);
        fetchStories();
      } catch (error) {
        console.error('Failed to delete story:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Stories</h1>
        <Button onClick={() => {
          setSelectedStory(null);
          setShowModal(true);
        }}>
          Add New Story
        </Button>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Plays</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story._id}>
              <td>{story.title}</td>
              <td>{story.category?.name || 'Uncategorized'}</td>
              <td>
                {Math.floor(story.duration / 60)}:
                {(story.duration % 60).toString().padStart(2, '0')}
              </td>
              <td>{story.plays}</td>
              <td>
                <Badge bg={story.isActive ? 'success' : 'danger'}>
                  {story.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedStory(story);
                    setShowModal(true);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(story._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <StoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddEdit}
        story={selectedStory}
      />
    </Container>
  );
};

export default StoriesPage;