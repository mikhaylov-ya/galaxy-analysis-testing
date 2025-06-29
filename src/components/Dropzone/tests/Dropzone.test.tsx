import { Dropzone } from '@components/Dropzone';
import { isCsvFile, convertHighlightsToArray } from '@utils/analysis';
import { vi } from 'vitest';

import { genMockCsvFile } from '@/tests/mocks/mocks';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils'

vi.mock('@utils/analysis', () => ({
  isCsvFile: vi.fn(),
  convertHighlightsToArray: vi.fn(),
}));

describe('Dropzone', () => {
  const defaultProps = {
    file: null,
    status: 'idle' as const,
    error: null,
    onFileSelect: vi.fn(),
    onClear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает кнопку загрузки когда файл не выбран', () => {
    render(<Dropzone {...defaultProps} />);
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
    expect(screen.getByText('или перетащите сюда .csv файл')).toBeInTheDocument();
  });

  it('отображает лоадер во время обработки', () => {
    render(<Dropzone {...defaultProps} status="processing" />);
    expect(screen.getByText('идёт парсинг файла')).toBeInTheDocument();
  });

  it('отображает информацию о файле когда файл выбран', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    render(<Dropzone {...defaultProps} file={file} />);
    
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('файл загружен!')).toBeInTheDocument();
  });

  it('показывает ошибку валидации для неподдерживаемых файлов', async () => {
    (isCsvFile as jest.Mock).mockReturnValue(false);
    
    render(<Dropzone {...defaultProps} />);
    
    const input = screen.getByTestId('upload-button') as HTMLInputElement;
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
     waitFor(() => {
      expect(screen.getByText('Можно загружать только *.csv файлы')).toBeInTheDocument();
    });
  });

it('вызывает onFileSelect для валидных файлов', async () => {
  const mockIsCsvFile = isCsvFile as jest.MockedFunction<typeof isCsvFile>;
  const mockConvert = convertHighlightsToArray as jest.MockedFunction<typeof convertHighlightsToArray>;
  const mockedHighlights = [{ title: 'Some title', description: 'Mocked highlight' }];
  mockIsCsvFile.mockReturnValue(true);
  mockConvert.mockReturnValue(mockedHighlights);

  const onFileSelect = vi.fn();

  render(<Dropzone {...defaultProps} onFileSelect={onFileSelect} />);

  const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
  const file = genMockCsvFile();

  // Trigger the file input
  fireEvent.change(fileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(mockIsCsvFile).toHaveBeenCalledWith(file);
    expect(onFileSelect.mock.calls[0][0]).toMatchObject(file);
  });
});

  it('обрабатывает drag and drop события', () => {
    (isCsvFile as jest.Mock).mockReturnValue(true);
    const onFileSelect = vi.fn();
    
    render(<Dropzone {...defaultProps} onFileSelect={onFileSelect} />);
    
    const dropzone = screen.getByTestId('upload-button');
    
    fireEvent.dragEnter(dropzone);
    expect(screen.getByText('Отпустите для загрузки')).toBeInTheDocument();
    
    fireEvent.dragLeave(dropzone);
    expect(screen.getByText('или перетащите сюда .csv файл')).toBeInTheDocument();
  });

  it('показывает статус готовности', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    render(<Dropzone {...defaultProps} file={file} status="completed" />);
    
    expect(screen.getByText('готово!')).toBeInTheDocument();
  });

  it('показывает ошибку обработки', () => {
    render(<Dropzone {...defaultProps} error="Ошибка обработки файла" />);
    expect(screen.getByText('Ошибка обработки файла')).toBeInTheDocument();
  });
});