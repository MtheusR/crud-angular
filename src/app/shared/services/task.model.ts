export interface Task { // Define uma estrutura para as propriedades que devem ser implementadas, sem especificar o comportamento de cada uma
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
  completed: boolean;
}
