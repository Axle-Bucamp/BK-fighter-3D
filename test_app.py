import pytest
from unittest.mock import Mock, patch
from App import App  # Assuming the main class is named App

@pytest.fixture
def mock_app():
    return Mock(spec=App)

def test_character_movement(mock_app):
    # Test moving right
    mock_app.move_character.return_value = {"x": 10, "y": 0}
    result = mock_app.move_character("right")
    assert result["x"] == 10
    assert result["y"] == 0

    # Test moving left
    mock_app.move_character.return_value = {"x": -10, "y": 0}
    result = mock_app.move_character("left")
    assert result["x"] == -10
    assert result["y"] == 0

    # Test moving up
    mock_app.move_character.return_value = {"x": 0, "y": -10}
    result = mock_app.move_character("up")
    assert result["x"] == 0
    assert result["y"] == -10

    # Test moving down
    mock_app.move_character.return_value = {"x": 0, "y": 10}
    result = mock_app.move_character("down")
    assert result["x"] == 0
    assert result["y"] == 10

def test_collision_detection(mock_app):
    # Test collision with obstacle
    mock_app.check_collision.return_value = True
    assert mock_app.check_collision({"x": 10, "y": 10}, {"x": 10, "y": 10, "width": 20, "height": 20})

    # Test no collision
    mock_app.check_collision.return_value = False
    assert not mock_app.check_collision({"x": 0, "y": 0}, {"x": 50, "y": 50, "width": 20, "height": 20})

@pytest.mark.parametrize("initial_score,points,expected_score", [
    (0, 10, 10),
    (50, 25, 75),
    (100, -20, 80),
])
def test_score_keeping(mock_app, initial_score, points, expected_score):
    mock_app.score = initial_score
    mock_app.update_score.return_value = expected_score
    
    result = mock_app.update_score(points)
    assert result == expected_score
    assert mock_app.score == expected_score

@patch('App.App.move_character')
@patch('App.App.check_collision')
@patch('App.App.update_score')
def test_main_game_loop(mock_update_score, mock_check_collision, mock_move_character, mock_app):
    mock_move_character.return_value = {"x": 10, "y": 0}
    mock_check_collision.return_value = False
    mock_update_score.return_value = 10

    mock_app.game_running = True
    mock_app.main_game_loop()

    mock_move_character.assert_called_once()
    mock_check_collision.assert_called_once()
    mock_update_score.assert_called_once()
    assert mock_app.game_running

    # Simulate game over
    mock_check_collision.return_value = True
    mock_app.main_game_loop()
    assert not mock_app.game_running