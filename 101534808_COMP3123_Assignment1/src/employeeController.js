const Employee = require('./Employee');
const logger = require('./logger');

exports.list = async (req, res, next) =>
{
  try
  {
    const employees = await Employee.find({ user: req.user.id });
    res.status(200).json(employees);
  }
  catch (errors)
  {
    next(errors);
  }
};

exports.create = async (req, res, next) =>
{
  try
  {
    const employee = await Employee.create(
        {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        position: req.body.position,
        salary: req.body.salary,
        date_of_joining: req.body.date_of_joining,
        department: req.body.department,
        user: req.user.id,
        }
    );
    logger.info('Employee created', { userId: req.user.id });
    res.status(201).json({ status: true, message: 'Employee created successfully', employee });
  }
  catch (errors)
  {
    next(errors);
  }
};

exports.getOne = async (req, res, next) =>
{
  try
  {
    const employee = await Employee.findById(req.params.eid);
    if (!employee)
    {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    if (employee.user.toString() !== req.user.id)
    {
      logger.warn('Authorization failed: employee belongs to another user', { userId: req.user.id });
      return res.status(403).json({ status: false, message: 'You do not have access to this employee' });
    }
    res.status(200).json(employee);
  }
  catch (errors)
  {
    next(errors);
  }
};

exports.update = async (req, res, next) =>
{
  try
  {
    const employee = await Employee.findById(req.params.eid);
    if (!employee)
    {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    if (employee.user.toString() !== req.user.id)
    {
      logger.warn('Authorization failed: employee belongs to another user', { userId: req.user.id });
      return res.status(403).json({ status: false, message: 'You do not have access to this employee' });
    }
    if (req.body.first_name)
    {
        employee.first_name = req.body.first_name;
    }
    if (req.body.last_name)
    {
        employee.last_name = req.body.last_name;
    }
    if (req.body.email)
    {
        employee.email = req.body.email;
    }
    if (req.body.position)
    {
        employee.position = req.body.position;
    }
    if (req.body.salary)
    {
        employee.salary = req.body.salary;
    }
    if (req.body.date_of_joining)
    {
        employee.date_of_joining = req.body.date_of_joining;
    }
    if (req.body.department)
    {
        employee.department = req.body.department;
    }
    await employee.save();
    logger.info('Employee updated', { userId: req.user.id });
    res.status(200).json({ status: true, message: 'Employee updated successfully', employee });
  }
  catch (errors)
  {
    next(errors);
  }
};

exports.remove = async (req, res, next) =>
{
  try
  {
    const employee = await Employee.findById(req.query.eid);
    if (!employee)
    {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    if (employee.user.toString() !== req.user.id)
    {
      logger.warn('Authorization failed: employee belongs to another user', { userId: req.user.id });
      return res.status(403).json({ status: false, message: 'You do not have access to this employee' });
    }
    await employee.deleteOne();
    logger.info('Employee deleted', { userId: req.user.id });
    res.status(204).send();
  }
  catch (errors)
  {
    next(errors);
  }
};