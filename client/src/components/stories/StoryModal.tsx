import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Story, Category } from '../../types/api.types';
import { getCategories } from '../../services/categoryService';

interface StoryModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<Story>) => Promise<void>;
  story?: Story | null;
}

const StoryModal = ({ show, onHide, onSubmit, story }: StoryModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTitle(story?.title || '');
      setDescription(story?.description || '');
      setAudioUrl(story?.audioUrl || '');
      setCategory(story?.category?._id || '');
      setDuration(story?.duration || 0);
      setIsActive(story?.isActive ?? true);

      fetchCategories();
    }
  }, [show, story]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedCategory = categories.find(c => c._id === category);
      await onSubmit({ title, description, audioUrl, category: selectedCategory!, duration, isActive });
      onHide();
    } catch (error) {
      console.error('Failed to submit story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{story ? 'Edit Story' : 'Add New Story'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Audio URL</Form.Label>
            <Form.Control
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (in seconds)</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StoryModal;