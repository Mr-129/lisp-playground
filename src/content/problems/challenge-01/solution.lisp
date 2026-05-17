(defun qsort (lst)
  (if (null lst)
      nil
      (let* ((pivot (car lst))
             (rest (cdr lst))
             (less (remove-if-not (lambda (x) (< x pivot)) rest))
             (greater (remove-if (lambda (x) (< x pivot)) rest)))
        (append (qsort less) (list pivot) (qsort greater)))))
(print (qsort '(3 1 4 1 5 9 2 6 5 3)))